danta.app(function () {
  var app = this
  var $d = danta
  var $w = danta.$w

  this.hide_elements = function () {
    $w.search_results.hide()
    $w.msg.hide()
    $w.view.hide(true)
  }

  this.display_movie = function (response) {
    if(response.error) {
      $w.view.stop_progress()
      $w.msg.display('Something went wrong. Please try again.', 'danger')

      return
    }

    if(response.rating > 5) {
      var img = new Image()
      img.onload = function () {
        $w.view.stop_progress()

        $w.msg.display(response.title + " is worth watching!", "success")
        $w.view.load(response)
        $("#poster_image", $w.view.element).attr("src", img.src)
        $w.view.show(true)
      }
      img.src = response.poster
    }
    else {
      $w.view.stop_progress()
      $w.msg.display(response.title + " is not worth watching")
    }
  }

  this.advise = function (movie, done) {
    $w.search_results.empty()
    $w.search_results.hide()

    var data = null
    if(data = $d.cache.get(movie.text)) { done(data) }
    else {
      $w.view.start_progress()

      $d.remote.call("advise", { imdb_url: movie.url }, function (status, response) {
        $d.cache.set(movie.text, response)
        done(response)
      })
    }
  }

  var last_query = "";
  this.search_results = function (response) {
    app.hide_elements();

    $w.search_results.empty();
    $w.search_results.concat(response);
    $w.search_results.show();
  }

  this.search = function (q, done) {
    var data = null;

    if(q.length > 2) {
      if(data = $d.cache.get(q)) { done(data); }
      else if(q !== last_query) {
        last_query = q;

        app.hide_elements();

        $w.film.start_progress();

        $d.remote.call("search", { query: q }, function (status, response) {
          response.forEach(function (e) { e.toString = function () {
            return e.text;
          }})

          $d.cache.set(q, response);

          $w.film.stop_progress();
          done(response);
        })
      }
    }
  }

  this.init = function () {
    $w.film.behave("progressable");
    $w.film.behave("typeable", { delay: 500, action: function () {
      app.search($w.film.value(), app.search_results);
    }})

    $w.search_results.behave("clickable", { action: function (clicked) {
      var item = $w.search_results.get(clicked.index());
      app.advise(item, app.display_movie);
    }});

    $w.msg.hide();

    $w.view.behave("progressable");
    $w.view.hide(true); // only the view container, not the widget
  }
})
