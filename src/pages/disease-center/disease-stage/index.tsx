import React, { useEffect, useState } from "react";
import { ManageStyleLayout } from "../../../components/layout/manage-style";
import {
  capitalize,
  ObjectKeys,
  parseQueryParameter,
} from "../../../utils/common";
import { InteractFactory } from "../../../services";
import { Case, CaseStages } from "../../../api/info-manage";
import { DiseaseAllStage, getDiseaseCase } from "../service";
import { MuiLoadingWrapper } from "../../../components/mui-loading";
import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@material-ui/core";
import { CaseStagesNames } from "../../admin/disease";
import { PictureOutlined } from "@ant-design/icons";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%",
  },
  tabs: {},
  panel: {
    flexShrink: 1,
    width: "100%",
  },
  content: {
    display: "flex",
    width: "100%",
  },
  divider: {
    margin: "10px 0 30px",
  },
  image: {
    objectFit: "scale-down",
    maxWidth: "100%",
    marginLeft: "20px",
  },
  placeholderIcon: {
    fontSize: "5rem",
    color: "#6e6e6e",
  },
  imageWrapper: {},
  iconWrapper: {
    backgroundColor: "#e6e6e6",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    maxWidth: "80%",
    display: "table",
    margin: "10px auto 0",
  },
}));

interface Stage {
  stage: CaseStages;
  case_: Case | null;
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  index: any;
  value: any;
  className: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  index,
  value,
  className,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className={className}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export const DiseaseStage: React.FC = () => {
  const { id } = parseQueryParameter<{ id: number }>({ id: -1 });
  const [diseaseAllStage, setDiseaseAllStage] = useState<DiseaseAllStage>({
    therapeuticSchedule: null,
    clinicalReception: null,
    introduce: null,
    check: null,
    diagnosis: null,
  });
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    getDiseaseCase(id)
      .then((res) => {
        setDiseaseAllStage(res);
        setLoading(false);
      })
      .catch((reason) => {
        InteractFactory.getMessager().fail(reason);
      });
  }, [id]);

  if (id <= 0) {
    InteractFactory.getMessager().fail("参数非法");
    return null;
  }

  const stages: Stage[] = ObjectKeys(diseaseAllStage).map(
    (key): Stage => {
      const stage = CaseStages[capitalize(key)];
      // @ts-ignore
      return { stage: stage, case_: diseaseAllStage[key] };
    }
  );

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentStage(newValue);
  };
  return (
    <ManageStyleLayout title={"阶段"}>
      {loading ? (
        <MuiLoadingWrapper />
      ) : (
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            value={currentStage}
            onChange={handleTabChange}
            className={classes.tabs}
            aria-label="Disease Stage tabs"
          >
            {stages.map(({ stage, case_ }, index) => (
              <Tab
                key={stage}
                label={CaseStagesNames[stage]}
                disabled={case_ === null}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          {stages.map(
            ({ stage, case_ }, index) =>
              case_ !== null && (
                <TabPanel
                  value={currentStage}
                  index={index}
                  key={stage}
                  className={classes.panel}
                >
                  <Typography variant="h3" component="h2">
                    {CaseStagesNames[stage]}
                  </Typography>
                  <Divider className={classes.divider} />
                  <Grid container spacing={3} className={classes.content}>
                    <Grid item xs={7}>
                      <Typography variant="body1" gutterBottom>
                        {case_.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} className={classes.imageWrapper}>
                      {!!case_.image ? (
                        <img
                          alt="image"
                          src={case_.image}
                          className={classes.image}
                        />
                      ) : (
                        <div className={classes.iconWrapper}>
                          <PictureOutlined
                            className={classes.placeholderIcon}
                          />
                        </div>
                      )}
                    </Grid>
                  </Grid>
                  {!!case_.video && (
                    <>
                      <Typography variant="h4">视频资源</Typography>
                      <Divider className={classes.divider} />
                      <video controls className={classes.video}>
                        <source src={case_.video} />
                      </video>
                    </>
                  )}
                </TabPanel>
              )
          )}
        </div>
      )}
    </ManageStyleLayout>
  );
};
