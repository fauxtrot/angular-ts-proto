using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace DataAccess.Model
{
    [TsClass]
    public class UserInfo
    {
        public string Username { get; set; }
        public long ProviderUserKey { get; set; }
        public int NodeId { get; set; }
    }
}
