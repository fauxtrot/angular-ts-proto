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
        IEnumerable<Session> GetSessionByPropertyValue(string propertyName, string value);
        void AddSession(Session session, long userKey);
        void LikeSession(Session session, int id);
    }
}
