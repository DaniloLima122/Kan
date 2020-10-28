using System.Runtime.CompilerServices;
using System.Data.Common;
using System;
using Microsoft.AspNetCore.Identity;

namespace MeuProjeto.Models
{
    public class Card
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Data { get; set; }
        public string UserId { get; set; }
        public string statusCard { get; set; }
    

    }

    
}


