using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Model;

namespace DataAccess
{
    public interface ICamperDataAccess
    {
        IEnumerable<Session> GetSessions();
        Session GetSessionById(long id);
        void AddSession(Session session, long userKey);
        void LikeSession(Session session, int id);
        IEnumerable<Comment> GetCommentsForSession(int id);
        Comment AddCommentToSession(Session session, int id, Comment comment);
        void LikeNode(int nodeId, int id);
        void UnLikeNode(int nodeId, int id);
        IEnumerable<UserInfo> GetLikedByList(int nodeId);
    }
}
