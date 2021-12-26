module.exports = (lat1, lon1, lat2, lon2) => {
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;

    let partialCalculation = (0
        + Math.pow(Math.sin((lat2 - lat1) / 2), 2)
        + (1
            * Math.cos(lat1)
            * Math.cos(lat2)
            * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
        )
    );

    return(1
        * 12742
        * Math.atan2(
            Math.sqrt(partialCalculation),
            Math.sqrt(1 - partialCalculation)
        )
    );
}