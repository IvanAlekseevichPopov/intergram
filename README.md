# Chat server - [Demo](https://ivanalekseevichpopov.github.io/web-chat/)

```html

<script>
  <style>
    #intergramRoot {
          font - family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  </style>
  <script>
    window.projectId = 'qaw4yawsrhzrdhf';
    window.intergramServer = 'https://v20847.hosted-by-vdsina.com/';
    window.intergramCustomizations = {
    closedChatAvatarUrl: 'https://v20847.hosted-by-vdsina.com/media/demo_avatar.png',
    horizontalPosition: 'left',
    introMessage: 'Здравствуйте, чем я могу вам помочь?',
    visitorPronoun: 'Вы',
    closedStyle: 'button', // button or chat
  };
</script>
<script src="https://v20847.hosted-by-vdsina.com/js/widget.js"></script>
</script>
<script id="intergram" type="text/javascript" src="https://www.intergram.xyz/js/widget.js"></script>
```

TODO:
github actions build of docker image
fix dev server
remove node_modules from final build
remove sound??
add http request retry
save web chat to database
bot writing animation

