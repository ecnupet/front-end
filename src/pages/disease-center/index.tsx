import React, { createRef, ReactElement, useEffect, useState } from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { renderHeader } from "../test-center";
import {
  Button,
  createStyles,
  List,
  ListItem,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { getDiseases } from "./service";
import { Disease } from "../../api/info-manage";
import { InteractFactory } from "../../services";
import { BackToHome } from "../../components/back-to-home";
import { openPage } from "../../utils/common";
import { MuiLoadingWrapper } from "../../components/mui-loading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutContainer: {
      position: "relative",
      height: "100%",
      width: "100%",
    },
    mainList: {
      flex: 1,
      overflow: "auto",
      paddingRight: "60px",
    },
    listSubheader: {
      backgroundColor: theme.palette.background.paper,
      borderBottom: "1px solid gray",
      position: "static",
      fontSize: "0.9rem",
      color: "rgba(0,0,0,0.56)",
      paddingLeft: "16px",
      paddingTop: "12px",
      fontWeight: "bold",
    },
    ul: {
      display: "flex",
      flexBasis: "12px",
      flexWrap: "wrap",
    },
    listItem: {
      maxWidth: "240px",
    },
    button: {
      width: "100%",
      color: theme.palette.primary.dark,
    },
    container: {
      display: "flex",
      height: "100%",
    },
    nav: {
      position: "sticky",
      overflow: "auto",
    },
    navListItem: {
      paddingTop: "1px",
      paddingBottom: "1px",
    },
    navButtonLabel: {
      writingMode: "vertical-lr",
    },
    navButtonRoot: {
      minWidth: 0,
      padding: "6px 3px",
      borderRadius: 0,
      height: "86px",
    },
  })
);

export const DiseaseCenter: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [groupRefs, setGroupRefs] = useState<React.RefObject<HTMLDivElement>[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [diseaseGroups, setDiseaseGroups] = useState<Map<string, Disease[]>>(
    new Map()
  );

  useEffect(() => {
    getDiseases()
      .then((data) => {
        const groups = data.reduce<Map<string, Disease[]>>(
          (groups, disease) => {
            if (groups.has(disease.diseaseType)) {
              groups.get(disease.diseaseType)!.push(disease);
            } else {
              groups.set(disease.diseaseType, [disease]);
            }
            return groups;
          },
          new Map()
        );
        setDiseaseGroups(groups);
        setGroupRefs((refs) =>
          Array(groups.size)
            .fill(0)
            .map((_, i) => refs[i] ?? createRef())
        );
        setLoading(false);
      })
      .catch((reason) => {
        InteractFactory.getMessager().fail(reason);
      });
  }, []);

  const handleNavItemClick = (index: number) => {
    groupRefs[index]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleDiseaseCaseClick = (id: number) => {
    openPage("/disease-center/stage", { id });
  };
  return (
    <ManageStyleLayout title="病例中心" headerChildren={renderHeader()}>
      {loading ? (
        <MuiLoadingWrapper />
      ) : (
        <div className={classes.container}>
          <nav className={classes.nav}>
            <List>
              {[...diseaseGroups.keys()].map((type, index) => (
                <ListItem
                  key={type}
                  className={classes.navListItem}
                  onClick={() => handleNavItemClick(index)}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    classes={{
                      root: classes.navButtonRoot,
                      label: classes.navButtonLabel,
                    }}
                  >
                    {type}
                  </Button>
                </ListItem>
              ))}
            </List>
          </nav>
          <List subheader={<div />} className={classes.mainList}>
            {[...diseaseGroups].map(([type, diseases], index) => (
              <li key={type}>
                <div ref={groupRefs[index]} className={classes.listSubheader}>
                  {type}
                </div>
                <ul className={classes.ul}>
                  {diseases.map((disease) => (
                    <ListItem
                      key={`case-${type}-${disease.id}`}
                      className={classes.listItem}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        onClick={() => handleDiseaseCaseClick(disease.id)}
                      >
                        {disease.diseaseName}
                      </Button>
                    </ListItem>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </div>
      )}
      <BackToHome />
    </ManageStyleLayout>
  );
};
