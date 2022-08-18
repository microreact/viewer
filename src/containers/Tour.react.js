import { connect } from "react-redux";

import { setTourStep } from "../actions/layout";
import { getTourSteps } from "../selectors/layout";
import Tour from "../components/Tour.react";

const mapStateToProps = (state) => {
  const steps = getTourSteps(state);
  const currentStepIndex = steps.indexOf(state.layout.tourStep);
  const totalSteps = steps.length;
  const previousStep = (currentStepIndex > 1) ? steps[currentStepIndex - 1] : null;
  const nextStep = (currentStepIndex < totalSteps) ? steps[currentStepIndex + 1] : null;

  return {
    currentStep: state.layout.tourStep,
    steps,
    previousStep,
    nextStep,
    currentStepIndex,
    totalSteps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onStepChange: (step) => dispatch(setTourStep(step)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(Tour);
