'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const httpRequest = new XMLHttpRequest();
  
  httpRequest.onreadystatechange = () => {
    if( httpRequest.readyState ===4 && httpRequest.status === 200) {
      const response = httpRequest.responseText;
      const data = JSON.parse(response);
      document.getElementById('tree').appendChild(addDirectory(data));

      Array.from(document.getElementsByTagName('a')).forEach( (a) => {
        a.onclick = (function (e) {
          e.preventDefault();
          e.stopPropagation();
          const setMd = new XMLHttpRequest();
          setMd.onreadystatechange = () => {
            if( setMd.readyState ===4 && setMd.status === 200) {
              document.getElementById('md');
              md.innerHTML = setMd.responseText;
            }
          }
          setMd.open('GET', a.href);
          setMd.send();
        });
      });
      Array.from(document.getElementsByClassName("directory")).forEach( (dir) => {
        dir.querySelectorAll('ul').forEach( (ul) => {
          ul.style.display = 'none';
        });
        dir.onclick = ( (e) => {
          e.stopPropagation();

          dir.querySelectorAll('ul').forEach( (ul) => {
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
          });
        });
      });
    }
  };
  httpRequest.open('GET', '/data');
  httpRequest.send();
});

function addDirectory(data) {
  const ul = document.createElement('ul');
  data.children.forEach(item => {
    const li = document.createElement('li');
    const text = document.createTextNode(item.name);

    if (item.type === 'file') {
      const a = document.createElement('a');
      a.appendChild(text);
      a.href = item.path;
      li.appendChild(a);
      li.classList.add('file');
    } else {
      li.appendChild(text);
      li.tabIndex = 0;
      li.appendChild(addDirectory(item));
      li.classList.add('directory');
    }
    ul.appendChild(li);
  });
  return ul;
}
