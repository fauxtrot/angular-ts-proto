using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nextwave.Neo4J.Membership.Data;
using TypeLite;


namespace DataAccess.Model
{
    [TsClass]
    public class Session
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SpeakerName { get; set; }
        public DateTimeOffset SessionDateTime { get; set; }
        public string Description { get; set; }
        public ICollection<UserInfo> LikedByUsers { get; set; }
    }
}
