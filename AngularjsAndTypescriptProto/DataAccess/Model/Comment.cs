using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Model
{
    public class Comment
    {
        public string Subject { get; set; }
        public UserInfo MadeBy { get; set; }
        public ICollection<UserInfo> LikedBy { get; set; }
        public string Body { get; set; }
        public int Id { get; set; }
    }
}
