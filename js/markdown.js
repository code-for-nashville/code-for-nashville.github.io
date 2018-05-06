function addMDExtension(path) {
  let newPath = path
  if (path.slice(path.length  -1) === '/'){
    newPath = path.slice(0, path.length -1) + '.md'
  } else {
    newPath = path + '.md'
  }
  return newPath
}

$(document).ready(function () {
  let path = window.location.pathname
  if (path.indexOf('handbook') > -1) {
    path = 'README.md'
  } else {
    path = addMDExtension(path)
  }

  $.get(
    'https://raw.githubusercontent.com/code-for-nashville/handbook/master/' + path,
    function (data, status) {
      var converter = new showdown.Converter()
      converter.setFlavor('github');
      var html = converter.makeHtml(data);
      var div = $('#handbook');
      div.html(html)
    }
  );
});
