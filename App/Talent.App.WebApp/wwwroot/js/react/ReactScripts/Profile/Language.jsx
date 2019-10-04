/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button, Icon } from 'semantic-ui-react';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        const languageData = props.languageData.map(x => Object.assign({}, x));
        this.state = {
            showAdd: false,
            showEdit: false,
            languageId: "",
            languages: languageData,
            newLanguage: {
                id: 0,
                name: "",
                level: ""
            }
        }
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
    };

    componentDidMount() {
        $('.ui.button.address')
            .popup();
    }

    //functions to handle buttons
    deleteLanguage(id) {
        const languages = this.props.languageData.map(x => Object.assign({}, x));
        let index = languages.findIndex((e) => e.id === id);
        languages.splice(index, 1);

        this.props.updateProfileData({
            languages
        })
    }

    addLanguage() {
        const languages = this.props.languageData.map(x => Object.assign({}, x));
        const newLanguage = this.state.newLanguage;
        languages.push(newLanguage);

        this.setState({
            showAdd: false
        });

        this.props.updateProfileData({
            languages
        })

    }

    openAdd() {
        let id = this.state.newLanguage.id;
        this.setState({
            newLanguage: {
                id: id + 1,
                name: "",
                level: ""
            },
            showAdd: true
        })
    }

    closeAdd() {
        this.setState({
            showAdd: false
        })
    }

    openEdit(language) {

        this.setState({
            languageId: language.id,
            newLanguage: language,
            showEdit: true
        })
    }

    closeEdit() {
        this.setState({
            showEdit: false
        })
    }

    updateLanguage(updatedLanguage) {
        const languages = this.props.languageData.map(x => Object.assign({}, x));
        const index = languages.findIndex((e) => e.id === updatedLanguage.id);
        languages[index].name = updatedLanguage.name;
        languages[index].level = updatedLanguage.level;

        this.setState({
            showEdit: false
        })
        this.props.updateProfileData({
            languages
        })
    }

    //functions to handle input
    handleChange() {
        debugger
        let data = Object.assign({}, this.state.newLanguage);
        data[event.target.name] = event.target.value;
        this.setState({
            newLanguage: data
        })

    }


    renderDisplay() {
        return (
            <div className='ui sixteen wide column'>
                <table className="ui single line table">
                    <thead>
                        <tr><th>Language</th>
                            <th>Level</th>
                            <th>
                                <button type="button" className="ui right floated teal button" onClick={this.openAdd}><i className="add icon"></i>Add New</button>
                            </th>
                        </tr></thead>


                    <tbody>
                        {this.renderLanguageWithOrWithoutData()}

                    </tbody>


                </table>
            </div>
        )
    }

    renderAdd() {
        const options = ["Basic",
            "Conversational",
            "Fluent",
            "Native",
            "Bilingual"];
        let language = this.state.newLanguage;
        const languageLevelOptions = options.map((x) => <option key={x} value={x}>{x}</option>);

        return (
            <div className='ui grid'>
                <div className="five wide column">
                    <input
                        name="name"
                        onChange={this.handleChange}
                        maxLength={20}
                        placeholder="Language Name"
                        value={language.name}
                    />
                </div>
                <div className="five wide column">
                    <select
                        name="level"
                        value={language.level}
                        onChange={this.handleChange}
                    >
                        <option value="Language Level">Language Level</option>
                        {languageLevelOptions}
                    </select>
                </div>
                <div className="six wide column">

                    <button type="button" className="ui teal button" onClick={this.addLanguage}>Add</button>
                    <button type="button" className="ui button" onClick={this.closeAdd}>Cancel</button>
                </div>

                {this.renderDisplay()}

            </div>

        )
    }

    renderLanguageWithOrWithoutData() {
        let languages = this.props.languageData;
        if (languages[0])
            console.log(languages[0].name);
        return (
            languages[0]
                ?
                languages.map(language => < LanguageData key={language.id} openEdit={this.openEdit} showEdit={this.state.showEdit}
                    closeEdit={this.closeEdit} language={language} id={this.state.languageId} handleChange={this.handleChange}
                    updateLanguage={this.updateLanguage} deleteLanguage={this.deleteLanguage}
                />
                )
                :
                <tr></tr>
        )
    }

    render() {

        return (
            this.state.showAdd ? this.renderAdd() : this.renderDisplay()
        )
    }
}


class LanguageData extends React.Component {
    constructor(props) {
        super(props);
        let updatedLanguage = Object.assign({}, this.props.language);
        this.state = {
            updatedLanguage: updatedLanguage
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        debugger;
        let updatedLanguage = this.state.updatedLanguage;
        updatedLanguage[event.target.name] = event.target.value;

        this.setState({
            updatedLanguage: updatedLanguage
        })
        console.log(this.props.language.name);
    }

    render() {
        let showEdit = this.props.showEdit;
        let language = this.props.language;
        let id = this.props.id;
        return (
            showEdit && (language.id == id) ?
                <tr>
                    <td>
                        <input value={this.state.updatedLanguage.name}
                            onChange={this.handleChange}
                            name="name"
                        />
                    </td>
                    <td>
                        <input value={this.state.updatedLanguage.level}
                            onChange={this.handleChange}
                            name="level"
                        />
                    </td>
                    <td>
                        <button className="ui blue basic button" onClick={() => this.props.updateLanguage(this.state.updatedLanguage)}>Update</button>
                        <button className="ui red basic button" onClick={this.props.closeEdit}>Cancel</button>
                    </td>
                </tr>
                :
                <tr>
                    <td>{language.name}</td>
                    <td>{language.level}</td>
                    <td>
                        <Button icon className="ui right floated button" onClick={() => this.props.deleteLanguage(language.id)}>
                            <Icon name='close' />
                        </Button>
                        <Button icon className="ui right floated button" onClick={() => this.props.openEdit(language)}>
                            <Icon name='pencil' />
                        </Button>
                    </td>
                </tr>
        )
    }
}