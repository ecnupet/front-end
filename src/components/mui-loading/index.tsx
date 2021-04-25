import React, { ReactElement } from "react";
import { CircularProgress, createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    loadingMask: {
      backgroundColor: "#000a1220",
      position: "relative",
      height: "100%",
      width: "100%",
    },
    loading: {
      position: "relative",
      backgroundColor: "#00000000",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

export const MuiLoadingWrapper: React.FC = (): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.loadingMask}>
      <CircularProgress className={classes.loading} />
    </div>
  );
};
