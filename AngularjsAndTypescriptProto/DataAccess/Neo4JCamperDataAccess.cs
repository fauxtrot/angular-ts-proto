using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using DataAccess.Model;
using DataAccess.Model.Relationships;
using Neo4jClient;
using Neo4jClient.Cypher;
using Nextwave.Neo4J.Membership.Data;

namespace DataAccess
{
    public class Neo4JCamperDataAccess : ICamperDataAccess
    {
        public IEnumerable<Session> GetSessions()
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));
            client.Connect();

            var list = client.Cypher
                  .Match("(s:Session)-[r:Liked_By]->(u)")
                  .Return(
                      (s, r, u) =>
                       new { Session = s.As<Session>(), SessId = s.Id(), Users = u.CollectAsDistinct<UserInfo>() })
                                .Results.Select(item =>
                                {
                                    item.Session.Id = (int)item.SessId;
                                    item.Session.LikedByUsers = item.Users.Select(u => u.Data).ToList();
                                    return item.Session;
                                });
            return list;

        }

        public Session GetSessionById(long id)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));
            client.Connect();

            var session = client.Cypher
                                .Start(new { s = string.Format("node({0})", id) }).Match("(s)-[r:Liked_By]->(u:User)")

                                .Return(
                                    (s, r, u) =>
                                    new { Session = s.As<Session>(), SessId = s.Id(), Users = u.CollectAsDistinct<UserInfo>() })
                                .Results.Select(item =>
                                    {
                                        item.Session.Id = (int)item.SessId;
                                        item.Session.LikedByUsers = item.Users.Select(u => u.Data).ToList();
                                        return item.Session;
                                    }).Single();
            return session;
        }

        public void AddSession(Session s, long userKey)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            var sess = s;
            client.Connect();
            var createdSession = client.Cypher.Create("(session:Session {session})")
                  .WithParams(new { session = sess })
                  .Return(session => session.Node<Session>())
                  .Results
                  .Single();
            client.Connect();
            var userNode =
                client.Cypher.Match("(u:User)").Where((User u) => u.ProviderUserKey == userKey).Return(u => u.Node<User>())
                      .Results.Single();
            client.CreateRelationship(createdSession.Reference, new CreatedByRelationship(userNode.Reference));

        }

        public void LikeSession(Session session, int id)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();

            var createdSession = client.Cypher.Match("(s:Session)")
                                       .Where((Session s) => s.Id == session.Id).Return(s => s.Node<Session>())
                                       .Results.Single();

            client.Connect();
            var userNode =
                client.Cypher.Match("(u:User)").Where((User u) => u.ProviderUserKey == id).Return(u => u.Node<User>())
                      .Results.Single();
            client.CreateRelationship(createdSession.Reference, new LikedBy(userNode.Reference));
        }

        public IEnumerable<Comment> GetCommentsForSession(int id)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();

            var result = client.Cypher.Start(new { s = string.Format("node({0})", id) })
                               .Match("(u:User)<-[mb:Created_By]-(c:Comment)-[o:On_Item]->(s:Session)")
                               .OptionalMatch("(c)-[lb:Liked_By]->(lbu:User)")
                               .Return((u, mb, c, s, o, lbu) => new { Comment = c.As<Comment>(), MadeByUser = u.Node<UserInfo>(), CommentNodeId = c.Id(), LikedByUsers = lbu.CollectAs<UserInfo>() })
                               .Results.Select(x =>
                               {
                                   x.Comment.MadeBy = x.MadeByUser.Data;
                                   x.Comment.MadeBy.NodeId = (int)x.MadeByUser.Reference.Id;
                                   x.Comment.MadeBy.ProviderUserKey = x.MadeByUser.Reference.Id;
                                   x.Comment.Id = (int)x.CommentNodeId;
                                   x.Comment.LikedBy = x.LikedByUsers.Select(ui => new UserInfo { Username = ui.Data.Username, ProviderUserKey = ui.Reference.Id, NodeId = (int)ui.Reference.Id }).ToList();
                                   return x.Comment;
                               });
            return result.ToList();
        }

        public Comment AddCommentToSession(Session session, int id, Comment comment)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();

            var result = client.Cypher.Create("(c:Comment {comm})")
                .WithParams(new {comm = comment})
                  .Return(c => c.Node<Comment>())
                  .Results
                  .Single();

            client.Connect();
            var userNode =
                client.Cypher.Match("(u:User)").Where((User u) => u.ProviderUserKey == id).Return(u => u.Node<User>())
                      .Results.Single();
            client.CreateRelationship(result.Reference, new CreatedByRelationship(userNode.Reference));
            client.Connect();
            var sessionNode = client.Cypher.Start(new {s = string.Format("node({0})", session.Id)})
                                    .Match("(s)")
                                    .Return(s => s.Node<Session>()).Results.Single();

            client.CreateRelationship(result.Reference, new OnSession(sessionNode.Reference));
            result.Data.Id = (int)result.Reference.Id;
            result.Data.MadeBy = userNode.Data.AsType<UserInfo>();
            result.Data.MadeBy.NodeId = (int) result.Data.MadeBy.ProviderUserKey;
            return result.Data;
        }

        public void LikeNode(int nodeId, int id)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();

            client.Cypher
                .Start(new { n = string.Format("node({0})", nodeId) })
                .Match("(u:User {ProviderUserKey : {id}})")
                .WithParam("id", id)
                .Create("(n)-[:Liked_By]->(u)").ExecuteWithoutResults();	
        }

        public IEnumerable<UserInfo> GetLikedByList(int nodeId)
        {
             var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();

            var results = client.Cypher.Start(new {n = string.Format("node({0})", nodeId)})
                  .Match("(n)-[:Liked_By]->(u:User)")
                  .Return(u => u.As<UserInfo>()).Results;

            return results;

        }

        public void UnLikeNode(int nodeId, int id)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));

            client.Connect();
            client.Cypher.Start(new {n = string.Format("node({0})", nodeId)})
                  .Match("(u:User)")
                  .Where((User u) => u.ProviderUserKey == id)
                  .Merge("(n)-[r:Liked_By]->(u:User)")
                  .Delete("r")
                  .ExecuteWithoutResults();
        }
    }
}