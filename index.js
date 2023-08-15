var videoElement = document.getElementById("mainVideoBg");
var videoSources = [
    "assets/videos/car1.mp4",
    "assets/videos/car2.mp4",
    "assets/videos/car3.mp4"
];
var currentIndex = 0;

function changeVideo() {
    videoElement.style.opacity = 0;
    setTimeout(function() {
        videoElement.src = videoSources[currentIndex];
        videoElement.style.opacity = 1; 
        currentIndex = (currentIndex + 1) % videoSources.length;
    }, 1000); 
}

changeVideo(); 
setInterval(changeVideo, 5000);

addEventListener('scroll', () => {
   let offset = window.pageYOffset

    console.log(offset)
    const title = document.getElementById('portfolioTitle')
    if (offset >= 250) {
       title.classList.add('portTitle')
    } else {
        title.classList.remove('portTitle')
    } 
})