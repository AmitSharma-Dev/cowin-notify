const fetch = require('node-fetch');
const player = require('play-sound')({ player: ".\\media\\mpg123.exe" });

// west : 142
// south west : 140 - done - 2
// south east: 144 - 5 (1 left)
// south delhi: 149 - done - 2*3
// shahdra: 148 - done
// north east: 147 - done
// north - 146 - done
// new delhi - 140 - done
// east delhi - 145 - done
// central delhi - 141 - done
const interval = setInterval(() => {
    const date = '07-06-2021';
    ['142', '144'].map(districtId => {
        const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;
        checkAvailability(url);
    });
}, 1 * 60 * 1000)

async function checkAvailability(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'authority': 'cdn-api.co-vin.in',
                'sec-ch-ua': '^\^',
                'accept': 'application/json, text/plain, */*',
                'sec-ch-ua-mobile': '?0',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
                'origin': 'https://www.cowin.gov.in',
                'sec-fetch-site': 'cross-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://www.cowin.gov.in/',
                'accept-language': 'en-US,en;q=0.9',
                'if-none-match': 'W/^\^18e12-nuJuqPcHUdHDL2OI/itYTx4ny1c^\^'
            }
        }).then(response => response.json());
        const centers = res.centers.filter(center => center['fee_type'] ==  "Free");
        const availableCenterForEighteen = centers.filter(center => {

            center.sessions = center.sessions.filter(session => 
                session['min_age_limit'] == 18
                && session['available_capacity_dose2'] > 1
                && session['vaccine'] == 'COVAXIN'
            );
            return center.sessions.length > 0;
        })
        if (availableCenterForEighteen.length > 0) {
            console.log("FOUND IT : " + JSON.stringify(availableCenterForEighteen));
            console.log("FOUND IT : " + availableCenterForEighteen[0].address + availableCenterForEighteen[0].name);
            console.log("*************************" + availableCenterForEighteen[0].pincode);
            console.log("##############################");
            soundAlarm();
        }
    } catch (error) {
        console.error(error);
    }
};

function soundAlarm() {
    console.log('playing sound');
    player.play('./media/roadrunner.mp3', (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });
}