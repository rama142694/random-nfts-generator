const mintButton = document.getElementById('mint-button');

mintButton.addEventListener('click', (e) => {
    MintNfts();
});

function MintNfts(){
    const nftsAmount = document.getElementById('amount-nfts').value;
    const account = document.getElementById('account').value;
    
    if(nftsAmount === undefined || nftsAmount === null || nftsAmount <= 0){
        alert('Amount of nfts empty or with a invalid number. Please enter a number greater than 0.');
        return;
    }

    const message = {
        amount: parseFloat(nftsAmount),
        account: account
    }

    fetch('http://localhost:3001/', {
        method: 'POST',
        body: JSON.stringify(message),
    })
}
