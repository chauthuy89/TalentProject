import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class VisaStatus extends React.Component {
    constructor(props) {
        const visaExpiryDate = props.visaExpiryDate ? moment(props.visaExpiryDate) : moment();
        const visaStatus = props.visaStatus ? props.visaStatus : "";
        super(props);
        this.state = {
            showEdit: false,
            showAdd: false,
            visaStatus: visaStatus,
            visaExpiryDate: visaExpiryDate
        }

        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChange.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        $('.ui.button.address')
            .popup();
    }

    save() {
        let visaStatus = this.state.visaStatus;
        let visaExpiryDate = this.state.visaExpiryDate;

        this.props.updateProfileData({
            visaStatus,
            visaExpiryDate
        })
    }

    handleChange(event) {
        debugger;
        let value = event.target.value;
        let visaStatus = value;
        this.setState({
            visaStatus: visaStatus
        })

        if (visaStatus == "Citizen" || visaStatus == "Permanent Resident") {
            this.props.updateProfileData({
                visaStatus
            })
        }
    }

    handleChangeDate(date, name) {
        if (name == "visaExpiryDate") {
            this.setState({
                visaExpiryDate: date
            })
        }
    }

    openAdd() {
        this.setState({
            showAdd: true
        })
    }

    closeAdd() {
        this.setState({
            showAdd: false
        })
    }

    openEdit() {
        this.setState({
            showEdit: true
        })
    }

    closeEdit() {
        this.setState({
            showEdit: false
        })
    }


    render() {

        let visaStatus = this.state.visaStatus;

        const options = ["Citizen",
            "Permanent Resident",
            "Work Visa",
            "Student Visa"
        ];

        let expiryDate = [];
        let saveButton = [];

        if (visaStatus == "Work Visa" || visaStatus == "Student Visa") {

            expiryDate = <div className="field"><label>Visa expiry date</label><DatePicker
                name="visaExpiryDate"
                selected={this.state.visaExpiryDate}
                minDate={moment()}
                onChange={(date) => this.handleChangeDate(date, "visaExpiryDate")}
            /></div>;

            saveButton = <div className="field"><br></br><button type="button" className="ui teal button" name="save" onClick={this.save}>save</button></div>
        }

        const visaOptions = options.map((x) => <option key={x} value={x}>{x}</option>)

        return (
            <div className="ui stackable three column grid">
                <div className="column">
                    <div className="field">
                        <label>Visa type</label>
                        <select
                            value={this.props.visaStatus}
                            onChange={this.handleChange}
                            name="visaStatus">
                            <option value="">Visa Status</option>
                            {visaOptions}
                        </select>
                    </div>
                </div>
                <div className="column">{expiryDate}</div>
                <div className="column">{saveButton}</div>
            </div>
        )
    }
}
