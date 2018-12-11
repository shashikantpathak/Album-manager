$(document).ready(function(){
    $('.delete-album').on('click',function(){
        var id = $(this).data('id');
        var url = '/albums/delete/'+id;
        if(confirm('Delete the album')){
            $.ajax({
                url:url,
                type:'DELETE',
                success:function(result){
                    window.location.href='/albums/index'
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    })
    $('.delete-genres').on('click',function(){
        var id = $(this).data('id');
        var url = '/genres/delete/'+id;
        if(confirm('Delete the album')){
            $.ajax({
                url:url,
                type:'DELETE',
                success:function(result){
                    window.location.href='/genres/index'
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    })
})

