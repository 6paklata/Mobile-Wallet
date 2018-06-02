export default {
    contractType: 'Transfer',
    walletUUID: '',
    types: {
        Transfer: {
            name: 'Send TRX',
            inputs: {
                recipient: {
                    text: 'Recipient',
                    label: 'What is the recipient address?',
                    type: 'default',
                },
                amount: {
                    text: 'Amount',
                    type: 'numeric',
                    label: 'How much TRX do you want to send?',
                },
            },
        },
        TransferAsset: {
            name: 'Send Token',
            inputs: {
                assetName: {
                    text: 'Asset Name',
                    label: 'Which token do you want to send?',
                    type: 'dropdown',
                    misc: {
                        options: [
                            { label: 'Tron', value: 'tron' },
                            { label: 'Other', value: 'other' }
                        ]
                    },
                },
                recipient: {
                    text: 'Recipient',
                    label: 'What is the recipient address?',
                    type: 'default',
                },
                amount: {
                    text: 'Amount',
                    type: 'numeric',
                    label: 'How much of the token do you want to send?',
                },
            },
        },
        AssetIssue: {
            name: 'Issue Asset',
            inputs: {
                assetName: {
                    text: 'Asset Name',
                    label: 'What is the name of your token?',
                    type: 'default',
                },
                assetAbbr: {
                    text: 'Asset Abbreviation',
                    label: 'What is the abbreviation of your token?',
                    type: 'default',
                },
                totalSupply: {
                    text: 'Total Supply',
                    type: 'numeric',
                    label: 'What is the total supply?'
                },
                exchangeRate: {
                    label: 'What will be the exchange rate for your token?',
                    type: 'exchange',
                },
                startTime: {
                    type: 'date',
                    label: 'What is the start date of the contract?'
                },
                endTime: {
                    type: 'date',
                    label: 'What is the end date of the contract?',
                },
                description: {
                    text: 'Enter a description...',
                    label: 'What is the description of your token?',
                    type: 'default',
                },
                url: {
                    text: 'Enter a url...',
                    label: 'What should the URL for your contract be?',
                    type: 'default',
                },
            },
        },
        FreezeBalance: {
            name: 'Freeze TRX',
            inputs: {
                amount: {
                    text: 'Amount',
                    type: 'numeric',
                    label: 'How much TRX would you like to freeze?'
                },
                duration: {
                    text: 'Days to freeze for',
                    type: 'numeric',
                    label: 'How many days would you like to freeze it for?'
                },
            },
        },
        UnfreezeBalance: {
            name: 'Unfreeze TRX',
            inputs: {},
        },
        ParticipateAssetIssue: {
            name: 'Token Participation',
            inputs: {
                assetName: {
                    text: 'Asset Name',
                    type: 'default',
                    label: 'What is the name of the token?',
                },
                amount: {
                    text: 'Amount',
                    type: 'numeric',
                    label: 'How much would you like to buy?',
                },
            },
        },
        VoteWitness: {
            name: 'Vote',
            inputs: {
                address: {
                    text: 'Address',
                    type: 'default',
                    label: 'What is the address of the vote?',
                },
                count: {
                    text: 'Number of votes',
                    type: 'numeric',
                    label: 'How many votes would you like to cast?',
                },
            },
        },
    },
    inputs: {
        
    },
    errors: [],
    outputHex: '',
};