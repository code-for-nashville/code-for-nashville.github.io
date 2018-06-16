(function(){
    var members = $('.github-name');
    var memberImages = $('.member-img');

    [].forEach.call(members, function(member, index){
        if($(member).attr('data-github')){
           $.get('https://api.github.com/users/' + $(member).attr('data-github'),function(data){
               var avatarImage = '';
               avatarImage = data.avatar_url;
               $(memberImages[index]).attr('src', avatarImage);
            })
        }
    })
})()
