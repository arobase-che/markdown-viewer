$(document).ready(function() {
    $.get('/data', function(data) {
        $('#tree').append(addDirectory(data));

        $('a').click(function(e) {
            $('#md').empty();
            $('.spinner').show();
            e.preventDefault();
            $.get(this.href, function(data) {
                $('.spinner').hide();
                $('#md').html(data);
            });
        });
    });
    $('.spinner').hide();
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
        } else {
            li.appendChild(text);
            li.appendChild(addDirectory(item));
        }
        ul.appendChild(li);
    });
    return ul;
}
