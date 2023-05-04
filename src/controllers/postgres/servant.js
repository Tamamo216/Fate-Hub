const Servant = require("../../models/postgres/servant");
const utils = require("../../utils/utils");
async function load(req,res,next) {
  const displayName = req.user["display_name"];
  if (req.query.hasOwnProperty("q")) {
    const nameSearch = req.query.q;
    Servant.searchByName(nameSearch, ["id", "name", "avatar", "details_url"])
      .then((servants) => {
        res.render("servants/servant_list_query", {matchServants: servants, displayName});
      })
      .catch((err) => next(err));
    return;
  }
  const className = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin", "Berserker", "Ruler", "Avenger", "Moon Cancer", "Alter Ego", "Foreigner", "Pretender"];
  let servantsByClass = [];
  for (let i = 0; i < className.length; ++i) {
    let servantClass = {
      class: className[i]
    }
    try {
      const servants = await Servant.getByClass(className[i], ["id", "name", "avatar", "details_url"]);
      servantClass.servants = servants;
      servantsByClass.push(servantClass);
    }
    catch(err) {
      next(err);
    }
  }
  res.render("servants/servant_list", { servantsByClass, displayName });
}

function details(req,res,next) {
  const displayName = req.user["display_name"];
  const detailsURL = "/servants/" + req.params.servantName;
  Servant.getDetails(detailsURL)
    .then((details) => {
      details.img_card_deck = "/img/" + details.img_card_deck;
      details.img_details = "/img/" + details.img_details;
      details.np_name = details.np_name.split(';');
      details.np_card = `/img/NP/${details.np_card}.webp`;
      details.skill1_description = utils.infoBreakIntoLines(details.skill1_description);
      details.skill2_description = utils.infoBreakIntoLines(details.skill2_description);
      details.skill3_description = utils.infoBreakIntoLines(details.skill3_description);
      details.np_effect = utils.infoBreakIntoLines(details.np_effect);
      details.np_oc = utils.infoBreakIntoLines(details.np_oc);
      res.render("servants/servant_details", { details, displayName });
    })
    .catch((err) => next(err));
}

module.exports = { load, details };