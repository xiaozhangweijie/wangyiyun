$.ajax({
    url: "/api/list",
    dataType: "json",
    success: function(data) {
        console.log(data);
    }
})