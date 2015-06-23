(function(){
    var members = $('.github-name');
    var memberImages = $('.member-img');

    [].forEach.call(members, function(member, index){
       $.get('https://api.github.com/users/' + $(member).attr('data-github') + '/events/public',function(data){
           var avatarImage;
           avatarImage = data[0].actor.avatar_url;
           $(memberImages[index]).attr('src', avatarImage);
       })
    })
})()
