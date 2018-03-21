import React from 'react'
import ReactDOM from 'react-dom'
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { defaultCellRangeRenderer, Grid } from 'react-virtualized';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

var tableStyle = {
    "border": "1px solid black"
};

let singleRow =
    {
        "white-space": "nowrap"
    }


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            countColumn: 50,
            countRow: 50,
            funcValue: "",
            funcDataRow: "",
            funcDataCell: "",
            EditDataCell: "",
            EditDataRow: "",
            open: false,
            valueSelectField: "1",
            selectTypeFunc: ""

        }
        this.handleRowClick = (e) => this.handleRowClickMethod(e);
        this.handleOpenFile = (e) => this.handleOpenFileMethod(e);
        this.handleChangeGrid = (e) => this.handleChangeGridMethod(e);
        this.cellRender = (e) => this.cellRenderMethod(e);
        this.handleChangeFunction = (e) => this.handleChangeFunctionMethod(e);
        this.handleOnBlure = (e) => this.handleOnBlureMethod(e);
        this.handleFocus = (e) => this.handleFocusMethod(e);
        this.handleOpenDialog = (e) => this.handleOpenDialogMethod(e);
        this.handleCloseDialog = (e) => this.handleCloseDialogMethod(e)
        this.handleChangeSelectField = (e, index, value) => this.handleChangeSelectFieldMethod(e, index, value)
    }

    handleChangeSelectFieldMethod(e, index, value) {

        this.setState({ funcValue: "=" + e.target.innerText + "()", valueSelectField: value }, () => this.handleChangeFunctionMethod(null))

    }
    handleOpenDialogMethod(e) {
        this.setState({ open: true })
    }
    handleCloseDialogMethod() {
        this.setState({ open: false })
    }
    handleFocusMethod(e) {
        this.setState({ EditDataCell: e.target.dataset.column });
        this.setState({ EditDataRow: e.target.dataset.row })
    }

    handleOnBlureMethod(e) {
    }

    handleChangeFunctionMethod(e) {
        if (e != null) {
            this.setState({ funcValue: e.target.value })
        }

        var d = this.state.list;
        if(e!=null)
        d[this.state.funcDataRow][this.state.funcDataCell] = e.target.value;
        else
        d[this.state.funcDataRow][this.state.funcDataCell] = this.state.funcValue;
        
        this.setState({ list: d })
    }
    handleChangeGridMethod(e) {
        var dataset = e.target.dataset;
        var d = this.state.list;
        d[dataset.row][dataset.column] = e.target.value;
        this.setState({ list: d });
        this.setState({ funcValue: e.target.value });
        console.log(e.target.value)
    }
    handleRowClickMethod(e) {
        let row = e.target.dataset.row;
        let column = e.target.dataset.column;
        let val = "";

        if (this.state.list[row][column] !== undefined)
            val = this.state.list[row][column]

        this.setState({ funcValue: val });
        this.setState({ funcDataRow: row });
        this.setState({ funcDataCell: column });
    }
    cellRenderMethod({ columnIndex, key, rowIndex, style }) {
        let valueOfFunc = this.state.list[rowIndex][columnIndex];

        if (columnIndex.toString() === this.state.EditDataCell && rowIndex.toString() === this.state.EditDataRow) {

            valueOfFunc = this.state.list[rowIndex][columnIndex]
        }
        else {

            if (this.state.list[rowIndex][columnIndex] !== undefined) {

                if (this.state.list[rowIndex][columnIndex].toString().charAt(0) === "=") {
                    let valuefield = this.state.list[rowIndex][columnIndex];
                    try {
                        valueOfFunc = eval(valuefield.toString().substr(1));
                    }
                    catch (error) {
                        valueOfFunc = valuefield;
                    }
                    if ((valueOfFunc.toString()).indexOf("MIN") != -1) {
                        let array = ((valueOfFunc.toString()).substr(5).slice(0, -1)).split(';')
                        let min = Math.min(...array);
                        valueOfFunc = min;
                    }
                   
                    if ((valueOfFunc.toString()).indexOf("MAX") != -1) {
                        let array = ((valueOfFunc.toString()).substr(5).slice(0, -1)).split(';')
                        let max = Math.max(...array);
                        valueOfFunc = max;
                    }
                    if ((valueOfFunc.toString()).indexOf("AVG") != -1) {

                        let array = ((valueOfFunc.toString()).substr(5).slice(0, -1)).split(';')
                        let len = array.length;

                        var sum = array.reduce((a, b) => parseInt(a) + parseInt(b), 0);
                        valueOfFunc = Math.round(sum / len);
                    }
                }
            }
            else {
                valueOfFunc = "";
            }
        }
        return (

            <input type="text"
                onChange={this.handleChangeGrid}
                onClick={this.handleRowClick}
                key={key}
                data-row={rowIndex}
                data-column={columnIndex}
                style={style}
                onBlur={this.handleOnBlure}
                onFocus={this.handleFocus}
                value={valueOfFunc}>
            </input>
        )
    }
    handleSaveOnChange(event) {
        //   event.stopPropagation();
        //    event.preventDefault();
        //   this.refs.fileUploader.click();

    }
    handleOpenOnChange(event) {
        // event.stopPropagation();
        // event.preventDefault();
        this.refs.fileUploader.click();
        //var file = event;
    }
    handleOpenFileMethod(e) {
        const reader = new FileReader()
        reader.onload = (e) => {
            var data = e.target.result;
            var q = eval('[' + e.target.result + ']')
            this.setState({ list: q });

        }
        reader.readAsText(e.target.files[0]);
    }
    scrolling(e) {

        if ((e.scrollWidth - e.clientWidth) < e.scrollLeft) {
            var col = this.state.countColumn;
            this.setState({ countColumn: col + 10 })
        }

        // доделать скролинг вертикальный
        // if ((e.scrollHeight - e.clientHeight) < e.scrollTop) {
        //     var data = this.state.list;
        //     var res = data.push([]);
        // }

    }
    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleCloseDialog}
            />,
        ];
        return (
            <MuiThemeProvider>
                <div>
                    <div >
                        <RaisedButton label="Open" key='1' onClick={this.handleOpenOnChange.bind(this)} />
                        <input type='file' id='file' ref="fileUploader" onChange={this.handleOpenFile} style={{ display: "none" }} />
                    </div>
                    <div style={singleRow}>
                        <span onClick={this.handleOpenDialog} style={{ "margin-right": "10px" }}>F(X):</span>

                        <Dialog
                            title="Select function"
                            actions={actions}
                            modal={false}
                            open={this.state.open}
                            onRequestClose={this.handleCloseDialog}>
                            <SelectField
                                floatingLabelText="Function"
                                value={this.state.valueSelectField}
                                onChange={this.handleChangeSelectField}>
                                <MenuItem value={1} primaryText="MAX" />
                                <MenuItem value={2} primaryText="MIN" />
                                <MenuItem value={3} primaryText="AVG" />
                            </SelectField>
                        </Dialog>
                        <TextField hintText="Edit function" data-row={this.state.funcDataRow} data-column={this.state.funcDataCell}
                            value={this.state.funcValue} fullWidth={true} onChange={this.handleChangeFunction} />
                    </div>
                    <div>
                        <Grid
                            cellRenderer={this.cellRender}
                            columnCount={this.state.countColumn}
                            columnWidth={100}
                            height={400}
                            rowCount={this.state.list.length}
                            rowHeight={30}
                            width={1000}
                            containerStyle={tableStyle}
                            onScroll={this.scrolling.bind(this)}
                        />
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('root')
)

