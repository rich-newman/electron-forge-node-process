document.getElementById("mybutton").addEventListener("click", (e) => {
    console.log("Button clicked");
    e.preventDefault();
    myAPI.runTest();
});