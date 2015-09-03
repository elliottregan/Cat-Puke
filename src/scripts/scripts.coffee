$(document).ready ->
  $('.report').click () ->
    $.ajax
      url: '/blagh'
      type: 'PUT'
      # data: 'name=John&location=Boston'
      success: (data) ->
        console.log data
        $('.report').addClass "reset"

  $.ajax
    url: '/days-passed'
    type: 'GET'
    success: (data) ->
      $('.days').html(data)
      if data == "one"
        $('figcaption').html(day)