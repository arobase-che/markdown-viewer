$(document).ready(function() {
    $.get('/data', function(data) {
        $('#tree').append(addDirectory(data));

        $('a').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            $.get(this.href, function(data) {
                $('#md').html(data);
            });
        });

        $('.directory').find('ul').hide();
        $('.directory').click(function(e) {
            e.stopPropagation();
            $(this).children('ul').slideToggle();
        });
    });
});


function addDirectory(data) {
    var ul = document.createElement('ul');
    data.children.forEach(function(item) {
        var li = document.createElement('li');
        var text = document.createTextNode(item.name);

        if (item.type === "file") {
            var a = document.createElement('a');
            a.appendChild(text);
            a.href = item.path;
            li.appendChild(a);
            li.classList.add("file");
        } else {
            li.appendChild(text);
            li.tabIndex = 0
            li.appendChild(addDirectory(item));
            li.classList.add("directory");
        }
        ul.appendChild(li);
    });
    return ul;
}
