import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Tooltip,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { Field, FormikProvider, useFormik } from "formik";
import {
  Language as LanguageIcon,
  Edit as EditIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  DesktopWindows as DesktopWindowsIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";

const initialRows = [
  {
    id: 1,
    monitorName: "Public Site",
    accountGroup: "Web",
    interval: 300,
    url: "https://example.com",
    desiredStatusCode: "200",
    followRedirects: "True",
    dataCenter: "Others",
    environment: "PRODUCTION",
  },
  {
    id: 2,
    monitorName: "API Gateway",
    accountGroup: "API",
    interval: 120,
    url: "https://api.example.com/health?region=us-east&service=gateway&version=2024-12-31",
    desiredStatusCode: "200",
    followRedirects: "True",
    dataCenter: "US-East",
    environment: "UAT",
  },
  {
    id: 3,
    monitorName: "Long URL Demo",
    accountGroup: "Ops",
    interval: 300,
    url: "https://very-long-domain.example.com/path/to/resource/with/a/very/long/name?tracking_id=abcdef1234567890&user=someone@example.com&campaign=winter-2026",
    desiredStatusCode: "200",
    followRedirects: "True",
    dataCenter: "EU",
    environment: "PRODUCTION",
  },
];

const defaultForm = {
  monitorName: "",
  accountGroup: "",
  interval: 300,
  url: "",
  desiredStatusCode: "200",
  followRedirects: "True",
  environment: "PRODUCTION",
  dataCenter: "Others",
  alertName: "",
  eventTicket: "",
  eventPage: "",
  emailList: "",
  eventTargetTicket: "None",
  eventTargetPage: "None",
  eventTargetTicketType: "None",
  eventTargetPageType: "None",
  reachability: "None",
  httpStatus: "None",
  latency: "None",
  sslExpiry: "None",
};

function StatCard({ title, value, action }) {
  return (
    <Paper className="stat-card" elevation={0}>
      <Typography className="stat-title" variant="body2">
        {title}
      </Typography>
      <Typography className="stat-value" variant="h5">
        {value}
      </Typography>
      {action ? <Typography className="stat-action">{action}</Typography> : null}
    </Paper>
  );
}

export default function App() {
  const [showPortal, setShowPortal] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    monitorName: false,
    url: false,
  });
  const [activeRowId, setActiveRowId] = React.useState(null);
  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [urlEditorOpen, setUrlEditorOpen] = React.useState(false);
  const formik = useFormik({
    initialValues: defaultForm,
    onSubmit: () => {},
  });

  const handleOpen = (row) => {
    formik.setValues({
      ...defaultForm,
      ...row,
    });
    setFormErrors({ monitorName: false, url: false });
    setActiveRowId(row.id);
    setIsCreateMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field) => (event) => {
    formik.setFieldValue(field, event.target.value);
    if (field === "monitorName" || field === "url") {
      setFormErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const handleCreateMonitor = () => {
    const placeholderRow = {
      id: Date.now(),
      monitorName: "",
      accountGroup: "",
      interval: 300,
      url: "",
      desiredStatusCode: "200",
      followRedirects: "True",
      dataCenter: "Others",
      environment: "PRODUCTION",
    };
    setRows((prev) => [placeholderRow, ...prev]);
    formik.setValues({
      ...defaultForm,
      ...placeholderRow,
    });
    setFormErrors({ monitorName: false, url: false });
    setActiveRowId(placeholderRow.id);
    setIsCreateMode(true);
    setOpen(true);
  };

  const handleSave = () => {
    const errors = {
      monitorName: formik.values.monitorName.trim() === "",
      url: formik.values.url.trim() === "",
    };
    setFormErrors(errors);
    if (errors.monitorName || errors.url) {
      return;
    }

    if (isCreateMode) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === activeRowId ? { ...row, ...formik.values } : row,
        ),
      );
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === activeRowId ? { ...row, ...formik.values } : row,
        ),
      );
    }
    setOpen(false);
  };

  const handleUrlEditorOpen = () => {
    setUrlEditorOpen(true);
  };

  const handleUrlEditorClose = () => {
    setUrlEditorOpen(false);
  };

  const targetOptions = [
    { label: "None", type: "None", value: "None" },
    {
      label: "Managed Group",
      type: "Managed Group",
      value: "mgroupmgroupmgroupmgroup",
    },
    {
      label: "Supported Group",
      type: "Supported Group",
      value: "sgroupsgroupsgroupsgroup",
    },
    { label: "Assignment Group", type: "Assignment Group", value: "" },
  ];

  const getTargetValue = (type, value) => {
    if (type === "Assignment Group") {
      return targetOptions.find((option) => option.type === "Assignment Group");
    }
    return (
      targetOptions.find((option) => option.type === type) || targetOptions[0]
    );
  };

  const handleTargetSelect =
    (typeField, valueField, linkedField) => (_, nextValue) => {
      if (typeof nextValue === "string") {
        formik.setFieldValue(typeField, "Assignment Group");
        formik.setFieldValue(valueField, nextValue);
        formik.setFieldValue(linkedField, nextValue);
        return;
      }
      if (!nextValue) {
        formik.setFieldValue(typeField, "None");
        formik.setFieldValue(valueField, "None");
        formik.setFieldValue(linkedField, "None");
        return;
      }
      const nextType = nextValue.type;
      const nextValueResolved =
        nextType === "Assignment Group" ? "" : nextValue.value;
      formik.setFieldValue(typeField, nextType);
      formik.setFieldValue(valueField, nextValueResolved);
      formik.setFieldValue(linkedField, nextValueResolved);
    };

  const handleTargetInput =
    (typeField, valueField, linkedField) => (_, nextValue, reason) => {
      if (reason !== "input") {
        return;
      }
      formik.setFieldValue(typeField, "Assignment Group");
      formik.setFieldValue(valueField, nextValue);
      formik.setFieldValue(linkedField, nextValue);
    };

  return (
    <FormikProvider value={formik}>
      <Box className="app-shell">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="toolbar">
          <Button
            className="logo-button"
            startIcon={<LanguageIcon />}
            onClick={() => setShowPortal(true)}
            variant="outlined"
          >
            URL
          </Button>
          <Typography variant="h6" className="app-title">
            Synthetic Monitoring Portal
          </Typography>
        </Toolbar>
      </AppBar>

      {!showPortal ? (
        <Box className="empty-state">
          <Typography variant="h5">Click the URL logo to open monitors</Typography>
          <Typography variant="body2">
            This will show the Create Monitor panel and the URL Monitor table.
          </Typography>
        </Box>
      ) : (
        <Box className="content">
          <Stack direction="row" spacing={2} className="top-stats">
            <StatCard title="YEAH" value="2516" action="Enable/Disable" />
            <StatCard title="LOL" value="56" />
            <StatCard title="Whatever" value="56" />
            <StatCard title="OH" value="56" />
          </Stack>

          <Paper className="monitor-panel" elevation={0}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Box className="create-monitor">
                <Box className="create-monitor-image">
                  <DesktopWindowsIcon fontSize="large" />
                  <Typography variant="subtitle1">Create Monitor</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure URL checks and alert conditions.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleCreateMonitor}
                >
                  Create Monitor
                </Button>
              </Box>

              <Box className="table-area">
                <Stack direction="row" spacing={1} className="table-header">
                  <Typography variant="h6">URL Monitors</Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Active"
                    color="success"
                    size="small"
                  />
                </Stack>
                <Divider className="divider" />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Monitor Name</TableCell>
                        <TableCell>Account Group</TableCell>
                        <TableCell>Interval</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Desired Status Code</TableCell>
                        <TableCell>Follow Redirects</TableCell>
                        <TableCell>Data Center</TableCell>
                        <TableCell>Environment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpen(row)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>{row.monitorName}</TableCell>
                          <TableCell>{row.accountGroup}</TableCell>
                          <TableCell>{row.interval}</TableCell>
                          <TableCell className="url-cell">
                            <Tooltip title={row.url} placement="top-start">
                              <span>{row.url}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{row.desiredStatusCode}</TableCell>
                          <TableCell>{row.followRedirects}</TableCell>
                          <TableCell>{row.dataCenter}</TableCell>
                          <TableCell>{row.environment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </Paper>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit URL Monitor Details</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                label="Monitor Name"
                fullWidth
                name="monitorName"
                value={formik.values.monitorName}
                onChange={handleChange("monitorName")}
                error={formErrors.monitorName}
                helperText={formErrors.monitorName ? "Monitor name is required" : " "}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                label="Account Group"
                fullWidth
                name="accountGroup"
                value={formik.values.accountGroup}
                onChange={handleChange("accountGroup")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                as={TextField}
                label="Interval (Seconds)"
                type="number"
                fullWidth
                name="interval"
                value={formik.values.interval}
                onChange={handleChange("interval")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                label="URL"
                fullWidth
                multiline
                minRows={1}
                maxRows={6}
                name="url"
                value={formik.values.url}
                onChange={handleChange("url")}
                error={formErrors.url}
                helperText={formErrors.url ? "URL is required" : " "}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Desired Status Code</InputLabel>
                <Select
                  label="Desired Status Code"
                  value={formik.values.desiredStatusCode}
                  onChange={handleChange("desiredStatusCode")}
                >
                  <MenuItem value="200">200 - OK</MenuItem>
                  <MenuItem value="201">201 - Created</MenuItem>
                  <MenuItem value="204">204 - No Content</MenuItem>
                  <MenuItem value="301">301 - Moved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Follow Redirects</InputLabel>
                <Select
                  label="Follow Redirects"
                  value={formik.values.followRedirects}
                  onChange={handleChange("followRedirects")}
                >
                  <MenuItem value="True">True</MenuItem>
                  <MenuItem value="False">False</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  label="Environment"
                  value={formik.values.environment}
                  onChange={handleChange("environment")}
                >
                  <MenuItem value="PRODUCTION">PRODUCTION</MenuItem>
                  <MenuItem value="UAT">UAT</MenuItem>
                  <MenuItem value="DEV">DEV</MenuItem>
                  <MenuItem value="TEST">TEST</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Data Center</InputLabel>
                <Select
                  label="Data Center"
                  value={formik.values.dataCenter}
                  onChange={handleChange("dataCenter")}
                >
                  <MenuItem value="Others">OTHERS</MenuItem>
                  <MenuItem value="US-East">US-East</MenuItem>
                  <MenuItem value="US-West">US-West</MenuItem>
                  <MenuItem value="EU">EU</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box className="section">
            <Typography variant="subtitle1">Alerts Configured</Typography>
            <Typography variant="body2" color="text.secondary">
              No alerts configured. Click "Add Alert" to create one.
            </Typography>
          </Box>

          <Box className="section">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Typography variant="subtitle1">Add Alert Configuration</Typography>
              <Typography variant="caption" color="text.secondary">
                * enter a valid event group
              </Typography>
            </Box>
            <Grid container spacing={2} className="section-grid">
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  label="Alert Name"
                  fullWidth
                  name="alertName"
                  value={formik.values.alertName}
                  onChange={handleChange("alertName")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                {
                  /**
                  * Stack is a Material UI layout helper. It stacks its children vertically and inserts consistent spacing between them. 
                  * Here, it just gives the Autocomplete a bit of breathing room; it doesn"t affect the input"s behavior.
                 */
                }
                <Stack spacing={1}>
                   {
                      /** freeSolo lets the MUI Autocomplete accept values that aren’t in the options list. 
                       * Without it, the user can only pick from the provided options. With it, they can type any custom event group or value. */
                    }
                  <Autocomplete
                    freeSolo
                    options={targetOptions}
                    value={getTargetValue(
                      formik.values.eventTargetTicketType,
                      formik.values.eventTargetTicket,
                    )}
                    onChange={handleTargetSelect(
                      "eventTargetTicketType",
                      "eventTargetTicket",
                      "eventTicket",
                    )}
                    onInputChange={handleTargetInput(
                      "eventTargetTicketType",
                      "eventTargetTicket",
                      "eventTicket",
                    )}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    /**
                     * renderInput is how you tell the Autocomplete what kind of text input to use for the user to type in.
                     * Here we use a standard Material UI TextField, and we pass it the params that Autocomplete gives us to connect it properly.
                     */
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Target Ticket"
                        multiline
                        minRows={1}
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Autocomplete
                    freeSolo
                    options={targetOptions}
                    value={getTargetValue(
                      formik.values.eventTargetPageType,
                      formik.values.eventTargetPage,
                    )}
                    onChange={handleTargetSelect(
                      "eventTargetPageType",
                      "eventTargetPage",
                      "eventPage",
                    )}
                    onInputChange={handleTargetInput(
                      "eventTargetPageType",
                      "eventTargetPage",
                      "eventPage",
                    )}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Target Page"
                        multiline
                        minRows={1}
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label="Email List"
                  fullWidth
                  name="emailList"
                  value={formik.values.emailList}
                  onChange={handleChange("emailList")}
                  helperText="Comma-separated emails"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                {formik.values.eventTargetTicketType === "Assignment Group" ? (
                  <Autocomplete
                    freeSolo
                    options={[
                      "mgroupmgroupmgroupmgroup",
                      "sgroupsgroupsgroupsgroup",
                    ]}
                    value={formik.values.eventTicket || ""}
                    onChange={(_, nextValue) =>
                      formik.setFieldValue("eventTicket", nextValue || "")
                    }
                    onInputChange={(_, nextInputValue) =>
                      formik.setFieldValue("eventTicket", nextInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Ticket"
                        multiline
                        minRows={1}
                      />
                    )}
                  />
                ) : (
                  <Field
                    as={TextField}
                    label="Event Ticket"
                    fullWidth
                    multiline
                    minRows={1}
                    name="eventTicket"
                    value={formik.values.eventTicket}
                    onChange={handleChange("eventTicket")}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                {formik.values.eventTargetPageType === "Assignment Group" ? (
                  <Autocomplete
                    freeSolo
                    options={[
                      "mgroupmgroupmgroupmgroup",
                      "sgroupsgroupsgroupsgroup",
                    ]}
                    value={formik.values.eventPage || ""}
                    onChange={(_, nextValue) =>
                      formik.setFieldValue("eventPage", nextValue || "")
                    }
                    onInputChange={(_, nextInputValue) =>
                      formik.setFieldValue("eventPage", nextInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Page"
                        multiline
                        minRows={1}
                      />
                    )}
                  />
                ) : (
                  <Field
                    as={TextField}
                    label="Event Page"
                    fullWidth
                    multiline
                    minRows={1}
                    name="eventPage"
                    value={formik.values.eventPage}
                    onChange={handleChange("eventPage")}
                  />
                )}
              </Grid>
            </Grid>
          </Box>

          <Box className="section">
            <Typography variant="subtitle1">Alert Conditions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Reachability</InputLabel>
                  <Select
                    label="Reachability"
                  value={formik.values.reachability}
                  onChange={handleChange("reachability")}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Target Unreachable">
                      Target Unreachable
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>HTTP Status</InputLabel>
                  <Select
                    label="HTTP Status"
                  value={formik.values.httpStatus}
                  onChange={handleChange("httpStatus")}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Non-2xx Response">
                      Non-2xx Response
                    </MenuItem>
                    <MenuItem value="HTTP 4xx Error">HTTP 4xx Error</MenuItem>
                    <MenuItem value="HTTP 5xx Error">HTTP 5xx Error</MenuItem>
                    <MenuItem value="HTTP 503 Error">HTTP 503 Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Latency</InputLabel>
                  <Select
                    label="Latency"
                  value={formik.values.latency}
                  onChange={handleChange("latency")}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="HTTP Latency Low">
                      HTTP Latency Low
                    </MenuItem>
                    <MenuItem value="HTTP Latency Medium">
                      HTTP Latency Medium
                    </MenuItem>
                    <MenuItem value="ICMP Latency Average">
                      ICMP Latency Average
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>SSL Certificate Expiry</InputLabel>
                  <Select
                    label="SSL Certificate Expiry"
                  value={formik.values.sslExpiry}
                  onChange={handleChange("sslExpiry")}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Expires 21 Days">Expires 21 Days</MenuItem>
                    <MenuItem value="Expires 7 Days">Expires 7 Days</MenuItem>
                    <MenuItem value="Expires 3 Days">Expires 3 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={urlEditorOpen}
        onClose={handleUrlEditorClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit URL (Large Editor)</DialogTitle>
        <DialogContent dividers>
          <Field
            as={TextField}
            label="URL"
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            name="url"
            value={formik.values.url}
            onChange={handleChange("url")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUrlEditorClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </FormikProvider>
  );
}
