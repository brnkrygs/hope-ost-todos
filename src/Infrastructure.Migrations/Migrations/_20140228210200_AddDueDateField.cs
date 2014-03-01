using System;
using FluentMigrator;

namespace Infrastructure.Migrations.Migrations
{
    [Migration(20140228210200)]
    public class _20140228210200_AddDueDateField : Migration
    {
        public override void Up( )
        {
            Alter.Table( "Todo" )
                .AddColumn( "DueDate" )
                .AsDateTime( )
                .NotNullable( )
                .WithDefaultValue( DateTime.UtcNow );
        }

        public override void Down( )
        {
            Delete.Column( "DueDate" )
                .FromTable( "Todo" );
        }
    }
}
