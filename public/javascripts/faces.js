// most code from
//Forked from [Andrew Canham](http://codepen.io/candroo/)'s Pen [3D Fold out reveal](http://codepen.io/candroo/pen/wKEwRL/).

function toggleIcon(el) {
  el.toggleClass("glyphicon-info-sign");
  el.toggleClass("glyphicon-minus-sign");
}

$(document).ready(function(){
  var zindex = 10;

  $("a.toggle-info").click(function (event) {
      event.preventDefault();
  });

  $("div.card").click(function(){
    var elem = $(this).find(".glyphicon");
    toggleIcon(elem);
    var isShowing = false;

    if ($(this).hasClass("show-detail")) {
      isShowing = true;

    }

    if ($("div.cards").hasClass("showing")) {
      // a card is already in view
      var newel = $("div.card.show-detail").find('.glyphicon');
      $("div.card.show-detail")
        .removeClass("show-detail");
      toggleIcon(newel);

      if (isShowing) {
        // this card was showing - reset the grid
        $("div.cards")
          .removeClass("showing");
        toggleIcon(elem);
      } else {
        // this card isn't showing - get in with it
        $(this)
          .css({zIndex: zindex})
          .addClass("show-detail");

      }

      zindex++;

    } else {
      // no cards in view
      $("div.cards")
        .addClass("showing");
      $(this)
        .css({zIndex:zindex})
        .addClass("show-detail");

      zindex++;
    }

  });
});
