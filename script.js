let images = [];
let currentPair = [];
let pairs = [];
let votes = {};
let ratings = {};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePairs() {
    for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
            pairs.push([images[i], images[j]]);
        }
    }
    shuffle(pairs);
}

function displayNextPair() {
    if (pairs.length === 0) {
        displayResults();
        return;
    }

    currentPair = pairs.pop();
    document.getElementById('leftImage').src = currentPair[0];
    document.getElementById('rightImage').src = currentPair[1];
}

function calculateRating(winner, loser) {
    const k = 32;
    const winnerRating = ratings[winner];
    const loserRating = ratings[loser];

    const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

    ratings[winner] = Math.round(winnerRating + k * (1 - expectedScoreWinner));
    ratings[loser] = Math.round(loserRating + k * (0 - expectedScoreLoser));
}

function vote(image) {
    const winner = image;
    const loser = currentPair.find(img => img !== winner);

    votes[winner]++;
    calculateRating(winner, loser);

    displayNextPair();
}

function displayResults() {
    document.getElementById('container').style.display = 'none';
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';

    const resultImagesDiv = document.getElementById('resultImages');
    resultImagesDiv.innerHTML = '';
    for (const [key, value] of Object.entries(votes)) {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('resultImageContainer');

        const img = document.createElement('img');
        img.src = key;
        img.classList.add('resultImage');

        const voteText = document.createElement('p');
        voteText.innerHTML = `${value} votes<br>Rating: ${ratings[key]}`;

        imgContainer.appendChild(img);
        imgContainer.appendChild(voteText);
        resultImagesDiv.appendChild(imgContainer);
    }
}

function startVoting() {
    const input = document.getElementById('imageUpload');
    if (input.files.length < 2) {
        alert('Please upload at least two images.');
        return;
    }

    images = [];
    votes = {};
    ratings = {};

    for (let file of input.files) {
        const url = URL.createObjectURL(file);
        images.push(url);
        votes[url] = 0;
        ratings[url] = 1500;
    }

    generatePairs();
    displayNextPair();

    document.getElementById('uploadContainer').style.display = 'none';
    document.getElementById('container').style.display = 'block';
}

document.getElementById('voteLeft').addEventListener('click', () => vote(currentPair[0]));
document.getElementById('voteRight').addEventListener('click', () => vote(currentPair[1]));
document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('results').style.display = 'none';
    document.getElementById('uploadContainer').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    pairs = [];
});

document.getElementById('startVoting').addEventListener('click', startVoting);
