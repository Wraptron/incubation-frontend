"use client";

import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import type {
  EvaluationScore,
  ProgramApplication,
  ProgramEvaluation,
  ProgramEvaluationCriteria,
  ProgramForm,
  ProgramFormField,
} from "./types";

export function useProgramForms() {
  const [forms, setForms] = useState<ProgramForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getForms();
      setForms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { forms, loading, error, refresh, setForms };
}

export function useProgramForm(formId: string) {
  const [form, setForm] = useState<ProgramForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!formId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getForm(formId);
      setForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateTitle = async (title: string) => {
    if (!form) return;
    const prev = form;
    setForm({ ...form, title });
    try {
      const updated = await api.updateForm(form.id, { title });
      setForm(updated);
    } catch (err) {
      setForm(prev);
      throw err;
    }
  };

  const patchFieldLocal = (fieldId: string, data: Partial<ProgramFormField>) => {
    setForm((f) => {
      if (!f) return f;
      return {
        ...f,
        fields: f.fields.map((field) =>
          field.id === fieldId ? { ...field, ...data } : field
        ),
      };
    });
  };

  const saveField = async (fieldId: string, data: Partial<ProgramFormField>) => {
    if (!form) return;
    patchFieldLocal(fieldId, data);
    try {
      const updated = await api.updateField(form.id, fieldId, data);
      patchFieldLocal(fieldId, updated);
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  const addField = async (partial?: Partial<ProgramFormField>) => {
    if (!form) return null;
    const created = await api.addField(form.id, partial ?? {});
    setForm((f) => (f ? { ...f, fields: [...f.fields, created] } : f));
    return created;
  };

  const removeField = async (fieldId: string) => {
    if (!form) return;
    const prev = form.fields;
    setForm({ ...form, fields: form.fields.filter((f) => f.id !== fieldId) });
    try {
      await api.deleteField(form.id, fieldId);
    } catch (err) {
      setForm({ ...form, fields: prev });
      throw err;
    }
  };

  const reorderFields = async (orderedIds: string[]) => {
    if (!form) return;
    const byId = new Map(form.fields.map((f) => [f.id, f]));
    const next = orderedIds
      .map((id, i) => {
        const f = byId.get(id);
        return f ? { ...f, sort_order: i } : null;
      })
      .filter((f): f is ProgramFormField => f !== null);
    setForm({ ...form, fields: next });
    try {
      const saved = await api.reorderFields(form.id, orderedIds);
      setForm((f) => (f ? { ...f, fields: saved } : f));
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  const patchCriteriaLocal = (
    criteriaId: string,
    data: Partial<ProgramEvaluationCriteria>
  ) => {
    setForm((f) => {
      if (!f) return f;
      return {
        ...f,
        criteria: f.criteria.map((c) =>
          c.id === criteriaId ? { ...c, ...data } : c
        ),
      };
    });
  };

  const saveCriteria = async (
    criteriaId: string,
    data: Partial<ProgramEvaluationCriteria>
  ) => {
    if (!form) return;
    patchCriteriaLocal(criteriaId, data);
    try {
      const updated = await api.updateCriteria(form.id, criteriaId, data);
      patchCriteriaLocal(criteriaId, updated);
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  const addCriteria = async (partial?: Partial<ProgramEvaluationCriteria>) => {
    if (!form) return null;
    const created = await api.addCriteria(form.id, partial ?? {});
    setForm((f) => (f ? { ...f, criteria: [...f.criteria, created] } : f));
    return created;
  };

  const removeCriteria = async (criteriaId: string) => {
    if (!form) return;
    const prev = form.criteria;
    setForm({ ...form, criteria: form.criteria.filter((c) => c.id !== criteriaId) });
    try {
      await api.deleteCriteria(form.id, criteriaId);
    } catch (err) {
      setForm({ ...form, criteria: prev });
      throw err;
    }
  };

  const reorderCriteria = async (orderedIds: string[]) => {
    if (!form) return;
    const byId = new Map(form.criteria.map((c) => [c.id, c]));
    const next = orderedIds
      .map((id, i) => {
        const c = byId.get(id);
        return c ? { ...c, sort_order: i } : null;
      })
      .filter((c): c is ProgramEvaluationCriteria => c !== null);
    setForm({ ...form, criteria: next });
    try {
      const saved = await api.reorderCriteria(form.id, orderedIds);
      setForm((f) => (f ? { ...f, criteria: saved } : f));
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  const publish = async () => {
    if (!form) return;
    const updated = await api.publishForm(form.id);
    setForm(updated);
    return updated;
  };

  return {
    form,
    loading,
    error,
    refresh,
    setForm,
    updateTitle,
    saveField,
    addField,
    removeField,
    reorderFields,
    saveCriteria,
    addCriteria,
    removeCriteria,
    reorderCriteria,
    publish,
  };
}

export function useProgramApplications(formId: string) {
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getApplications(formId);
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { applications, loading, error, refresh, setApplications };
}

export function useProgramApplication(appId: string) {
  const [application, setApplication] = useState<ProgramApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getApplication(appId);
      setApplication(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application");
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { application, loading, error, refresh, setApplication };
}

export function useProgramEvaluation(appId: string) {
  const [evaluation, setEvaluation] = useState<ProgramEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvaluation(appId);
      setEvaluation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load evaluation");
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveScores = async (scores: EvaluationScore[]) => {
    const updated = await api.saveEvaluationScores(appId, scores);
    setEvaluation(updated);
    return updated;
  };

  const submit = async (scores: EvaluationScore[]) => {
    const updated = await api.submitEvaluation(appId, scores);
    setEvaluation(updated);
    return updated;
  };

  return { evaluation, loading, error, refresh, saveScores, submit, setEvaluation };
}
