using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo4jClient;
using Nextwave.Neo4J.Membership.Data;

namespace DataAccess.Model.Relationships
{
    public class LikedBy : Relationship, IRelationshipAllowingSourceNode<Session>
    {
        public LikedBy(NodeReference targetNode) : base(targetNode)
        {
        }

        public LikedBy(NodeReference targetNode, object data) : base(targetNode, data)
        {
        }

        public override string RelationshipTypeKey
        {
            get { return "Liked_By"; }
        }
    }


}
