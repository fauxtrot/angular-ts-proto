using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo4jClient;

namespace DataAccess.Model.Relationships
{
    public class OnSession : Relationship, IRelationshipAllowingSourceNode<Comment>
    {
        public OnSession(NodeReference targetNode) : base(targetNode)
        {
        }

        public OnSession(NodeReference targetNode, object data) : base(targetNode, data)
        {
        }

        public override string RelationshipTypeKey
        {
            get { return "On_Session"; }
        }
    }
}
