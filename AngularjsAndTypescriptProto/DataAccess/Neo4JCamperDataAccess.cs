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
                      new {Session = s.As<Session>(), Users = u.CollectAsDistinct<UserInfo>()})
                  .Results.Select(item =>
                      {
                          item.Session.LikedByUsers = item.Users.Select(u => u.Data).ToList();
                          return item.Session;
                      });
            return list;
           
        }

        public IEnumerable<Session> GetSessionByPropertyValue(string propertyName, string value)
        {
            throw new System.NotImplementedException();
        }

        public void AddSession(Session s, long userKey)
        {
            var client = new GraphClient(new Uri("http://localhost:7474/db/data"));
            
            var sess = s;
            client.Connect();
            var createdSession = client.Cypher.Create("(session:Session {session})")
                  .WithParams(new {session = sess})
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
    }
}