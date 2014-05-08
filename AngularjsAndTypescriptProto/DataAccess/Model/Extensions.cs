using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nextwave.Neo4J.Membership.Interfaces;

namespace DataAccess.Model
{
    public static class Extensions
    {
        public static T AsType<T>(this object nodeItem)
            where T : INodeItem
        {
            return AutoMapper.Mapper.DynamicMap<T>(nodeItem);
        }
    }
}
