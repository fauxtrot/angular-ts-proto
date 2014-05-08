using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nextwave.Neo4J.Membership.Interfaces;
using TypeLite;

namespace DataAccess.Model
{
    [TsClass]
    public class UserInfo : INodeItem
    {
        public string Username { get; set; }
        public long ProviderUserKey { get; set; }
        public int NodeId { get; set; }
    }

    public static class UserInfoExtensions 
    {
        public static bool Likes(this UserInfo node, int nodeId)
        {
            ICamperDataAccess dal = new Neo4JCamperDataAccess();
            var list = dal.GetLikedByList(nodeId);
            return list.Select(x => x.ProviderUserKey).Contains(node.ProviderUserKey);
        }
    }
}
