using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo4jClient;
using Neo4jClient.Cypher;
using Nextwave.Neo4J.Membership.Data;

namespace DataAccess.Model.Relationships
{
    public class CreatedByRelationship: Relationship, IRelationshipAllowingSourceNode<Session>
    {
        public static readonly string TypeKey = "Created_By";


        public CreatedByRelationship(NodeReference targetNode) : base(targetNode)
        {
        }

        public CreatedByRelationship(NodeReference targetNode, object data) : base(targetNode, data)
        {
        }

        public override string RelationshipTypeKey
        {
            get { return TypeKey; }
        }
    }
}
