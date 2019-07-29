import React from "react";
import DropIn from "braintree-web-drop-in-react";


export default class Braintree extends React.Component {
	instance;

	state = {
		clientToken:null
	};

	async componentDidMount() {
		// Get a client token for authorization from your server
		const response = await fetch("https://staffed-app.herokuapp.com/client_token",{method:"GET"});
    const clientToken = await response.text(); // If returned as JSON string
    console.log(clientToken);

    console.log(response)
    if(response.status === 200){
		this.setState({
			clientToken
    });
  }
	}

	async buy() {
		// Send the nonce to your server
    const { nonce } = await this.instance.requestPaymentMethod();
    console.log(`The nonce is ${nonce}`);

    

		await fetch(`https://staffed-app.herokuapp.com/checkout?payment_method_nonce=${nonce}`,{
      method:"POST",
      mode:"no-cors"
    })
    .then((response) => {
      console.log(response.text());
    })
	}

	render() {
		if (!this.state.clientToken) {
			return (
				<div>
					<h1>Loading...</h1>
				</div>
			);
		} else {
			return (
				<div>
					<DropIn
            options={{ authorization: this.state.clientToken,
              paypal: {
                flow: "vault"
              } }}
						onInstance={instance => (this.instance = instance)}
					/>
					<button onClick={this.buy.bind(this)}>Buy</button>
				</div>
			);
		}
	}
}