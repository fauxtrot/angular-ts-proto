using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Neo4jClient;

namespace DataAccess.Model.Relationships
{
    public class AttendedBy : Relationship, IRelationshipAllowingSourceNode<Session>
    {
        public AttendedBy(NodeReference targetNode) : base(targetNode)
        {
        }

        public AttendedBy(NodeReference targetNode, object data) : base(targetNode, data)
        {
        }

        public override string RelationshipTypeKey
        {
            get { return "Attended_By"; }
        }
    }
}
