import React, {Component} from 'react';
// material UI
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {lighten} from '@material-ui/core/styles/colorManipulator';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const rows = [
  {id: 'ticker', numeric: false, disablePadding: true, label: 'Ticker'},
  {id: 'ordertype', numeric: false, disablePadding: false, label: 'Buy/Sell'},
  {id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity'},
  {id: 'orderstatus', numeric: false, disablePadding: false, label: 'Status'}
];

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map((row) => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

class TableToolbar extends Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    for (let i = 0; i < this.props.selected.length; i++) {
      fetch(`/order/${this.props.selected[i]}/cancel`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(() => {
        console.log('success in cancelling order!!!!');
        this.props.updateOrder();
      });
    }
  }

  render() {
    const {numSelected, classes} = this.props;
    console.log(this.props, 'listening to props from table toolbar ~~~~~~');
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              My Orders
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={this.handleDelete} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  }
}

TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};
TableToolbar = withStyles(toolbarStyles)(TableToolbar);

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

class MyOrders extends React.Component {
  constructor() {
    super();
    this.state = {
      order: 'asc',
      orderBy: 'ticker',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillMount() {
    // fetch('api/orders')
    //   .then((res) => res.json())
    //   .then((resultrows) => this.setState({data: resultrows}, () => console.log('result of fetch:', resultrows)));
    this.setState({
      data: this.props.result
    });
    console.log('this the state of enhanced table ~~~~~~~~ ', this.state); //state still unchanged
    console.log('this the props of enhanced table ~~~~~~~~ ', this.props);
  }

  // ---- socket implementation pending ----
  componentDidUpdate(prevProps) {
    if (this.props.result != prevProps.result) {
      console.log('updating props for myorders ~~~~~~~', this.props);
      this.setState({
        data: this.props.result
      });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({order, orderBy});
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      this.setState((state) => ({selected: state.data.map((n) => n.id)}));
      return;
    }
    this.setState({selected: []});
  };

  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    this.setState({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value});
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  render() {
    const {classes} = this.props;
    const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const result = data.filter((c) => c.user_id === this.props.user); //use result instead of state
    return (
      <Paper className={classes.root}>
        <TableToolbar
          numSelected={selected.length}
          selected={this.state.selected}
          updateOrder={this.props.updateOrder}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(result, getSorting(order, orderBy)) //somehow data to props doesnt happen twice so cant use data here
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.ticker}
                      </TableCell>
                      <TableCell>{n.ordertype}</TableCell>
                      <TableCell numeric>{n.quantity}</TableCell>
                      <TableCell>{n.orderstatus}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{height: 49 * emptyRows}}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

MyOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyOrders);