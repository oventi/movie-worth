danta.remote = {
  call: function (fn, params, done) {
    params["fn"] = fn;

    $.ajax({
      type: 'POST',
      url: danta.config.REMOTE_BASE_PATH,
      data: params,
      success: function (response) {
        return done(200, response)
      },
      error: function (xhr) {
        return done(xhr.status, JSON.parse(xhr.response))
      }
    })
  }
}
