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
  let selector
  if (path.indexOf('handbook') > -1) {
    path = 'https://raw.githubusercontent.com/code-for-nashville/handbook/master/README.md'
    selector = '#handbook'

  } else if (path.indexOf('code-of-conduct') > -1) {
    path = 'https://raw.githubusercontent.com/code-for-nashville/codeofconduct/master/README.md'
    selector = '#code-of-conduct'
  }/*  else { */
    // path = addMDExtension(path)
  /* } */

  $.get(path, function (data, status) {
      var converter = new showdown.Converter()
      converter.setFlavor('github');
      var html = converter.makeHtml(data);
      var div = $(selector);
      div.html(html)
    }
  );
});
