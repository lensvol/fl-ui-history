import { IBootstrapOptions } from 'actions/app/bootstrap';

const DEFAULT_BOOTSTRAP_OPTIONS = {
  fetchSpritesNow: false,
};

export default function createBootstrapOptions(
  options?: Partial<IBootstrapOptions>,
): IBootstrapOptions {
  return { ...DEFAULT_BOOTSTRAP_OPTIONS, ...(options ?? {}) };
}
