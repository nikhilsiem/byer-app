var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;


document.getElementsByClassName('productTable')[0].style.display='none';



  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
    // document.getElementById('navbarSupportedContent').className = "collapse navbar-collapse";
    if(document.getElementById('navbarSupportedContent').className=="navbar-collapse collapse show"){
    document.getElementById('btnNavbar').click();}
    // document.getElementById("btnNavbar").getAttribute("aria-expanded")=false;

  } else {
    document.getElementById("navbar").style.top = "-15px";
    
    if(document.getElementById('navbarSupportedContent').className=="navbar-collapse collapse show"){
    document.getElementById('btnNavbar').click();}
    
  }
  prevScrollpos = currentScrollPos;
}