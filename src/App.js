import React, {Component} from 'react';
import _ from 'lodash';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.debouncedOnChange = _.debounce(this.debouncedOnChange.bind(this), 200);
    }


    debouncedOnChange(value) {


        this.setState({
            message: "Checking...",
        });
        try {
            fetch(`https://hxj1tck8l1.execute-api.us-east-1.amazonaws.com/default/users/taken?username=${this.state.value}`)
            .then(response => response.json())
                .then(data => {
                        let messages;
                        console.log("messages");
                        console.log(messages);
                        try {
                            messages = data["taken"];
                            if (messages === true) {
                                messages = "Username is Taken!";
                            }
                            else if (messages === false) {
                                messages = "Username is Available!";
                            }
                            else{
                                messages = "Server Error, Please try after some time!";
                            }
                        }
                        catch (err) {
                            messages = "Server Error, Please try after some time!";
                        }

                        this.setState({
                            message: messages + "",
                        })
                    }
                )
                .catch(error => {
                    console.log("error");
                    console.log(error);

                    if (JSON.stringify(error).includes("{}")) {  //invalidJSON
                        this.setState({
                            message: "Bad String",
                        })
                    }
                    else {
                        this.setState({
                            message: "Server Error, Please try after some time!",
                        })
                    }

                })

        }
        catch (err) {
            this.setState({
                message: "Server Error, Please try after some time!",
            })
        }


    }

    handleChange(event) {
        this.setState({value: event.target.value});
        let val = event.target.value;
        if (val.length === 0) {
            this.setState({
                message: "",
            })
        }
        else if (val.length < 4) {
            this.setState({
                message: "Username must be at least 4 characters long",
            })
        }
        else {
            this.debouncedOnChange(event.target.value);
        }


    }

    render() {
        return (
            <div>
                <br/>
                <label><h4>
                    Name:
                    <input  type="text" name="name" value={this.state.value} onChange={this.handleChange}/>
                </h4> </label>
                <br/>   <br/>
                <span className="span">{this.state.message}</span>
            </div>);

    }
}

export default App;
