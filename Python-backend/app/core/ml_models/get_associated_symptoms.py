import pandas as pd

# Load dataset
data = pd.read_csv('app/core/ml_models/dataset/Training.csv', index_col=0)
data = data.drop('prognosis', axis=1)

# Select only symptom columns

symptom_columns = data.columns
symptom_data = data[symptom_columns]

symptom_data = symptom_data.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)

# Compute co-occurrence matrix
co_occurrence = symptom_data.T.dot(symptom_data)

# Normalize to calculate association probabilities
co_occurrence_prob = co_occurrence / co_occurrence.max(axis=1)


def get_associated_symptoms(symptom, threshold=0.9, top_n=5):
    associations = co_occurrence_prob.loc[symptom]
    sorted_associations = associations.sort_values(ascending=False)
    return sorted_associations[sorted_associations > threshold].head(top_n).index.tolist()

# Example: Get symptoms associated with sore throat
if __name__ == "__main__":
    print(co_occurrence_prob.loc['skin_rash'])
    associated_symptoms = get_associated_symptoms('skin_rash')
    print(associated_symptoms)
