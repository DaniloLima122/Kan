using System.Threading.Tasks;
using System.Runtime.Intrinsics.X86;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeuProjeto.Data;
using MeuProjeto.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace MeuProjeto.Controllers
{

    [Authorize]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext database;
        private readonly UserManager<IdentityUser> userManager;

        public DashboardController(ApplicationDbContext database, UserManager<IdentityUser> userManager)
        {

            this.database = database;
            this.userManager = userManager;

        }

        public IActionResult Index()
        {
         
            return View();
        }
        public JsonResult Search(string search)
        {
         
            var cards = database.Card.Where(card => card.UserId == userManager.GetUserId(User) && card.Name.Contains(search) || card.Description.Equals(search)).ToList();

            return Json(cards);
        }

        [HttpPost]
        public JsonResult AddCard(Card card)
        {

            database.Card.Add(card);

            database.SaveChanges();

            return Json(card);
        }

        [HttpPost]
        public IActionResult SetAsDone(int id){

            Card taskDone = database.Card.First(task => task.Id == id);

            taskDone.statusCard = "Done";

            database.SaveChanges();

            return Content("Tarefa marcada como concluida");

        }

        [HttpPost]
        public IActionResult EditTask(Card card){

            Card taskToEdit = database.Card.First(task => task.Id == card.Id);

            taskToEdit.Name = card.Name;
            taskToEdit.Description = card.Description;
            taskToEdit.Data = card.Data;
            taskToEdit.statusCard = card.statusCard;

            database.SaveChanges();

            return Json(taskToEdit);

        }

        [HttpPost]
        public IActionResult DeleteCard(int id)
        {   
            Card taskToDelete = database.Card.First(card => card.Id == id);

            database.Card.Remove(taskToDelete);

            database.SaveChanges();

            return Content("Card deleted");
        }


        public JsonResult Cards(string status)
        {
         
            var cards = database.Card.Where(card => card.UserId == userManager.GetUserId(User) && card.statusCard.Equals(status)).ToList();

            return Json(cards);
        }
    }
}