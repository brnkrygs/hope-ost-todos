using Core.Domain.Model.Todos;
using FluentNHibernate.Mapping;

namespace Infrastructure.NHibernate.Mapping.Todos
{
    public class TodoMap : ClassMap<Todo>
    {
        public TodoMap()
        {
            Id( x => x.Id ).GeneratedBy.Native();
            Map( x => x.Title ).Not.Nullable();
            Map( x => x.Completed ).Not.Nullable();
            Map( x => x.DueDate ).Not.Nullable();
            References( x => x.List, "List_id" ).Not.Nullable();
        }
    }
}