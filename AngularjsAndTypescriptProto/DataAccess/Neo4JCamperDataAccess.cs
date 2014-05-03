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
                  .Match("(s)-[r:Liked_By]->(u)")
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

            var result = client.Cypher.Start(new {s = string.Format("node({0})", id)})
                               .Match("(c)-[:On_Session]->(s)")
                               .Return(c => c.As<Comment>()).Results;
            return result.ToList();
        }

        public void AddCommentToSession(Session session, int id, Comment comment)
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
        }
    }
}